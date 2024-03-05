<?php

namespace App\Http\Controllers\Utilities;

use Illuminate\Http\Request;
use App\Models\Users\User;
use App\Models\Users\Person;
use App\Models\Users\Accounts\UserAccount;
use App\Http\Controllers\Controller;

class ContactInfoController extends Controller
{
	/**
	 * Get CSV of people who would like to receive the newsletter.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getContactInfo(Request $request) {
		$str = '';

		// get parameters
		//
		$password = $request->input('password');
		$isAffiliate = boolval($request->input('affiliate'));
		$option = $request->input('option', null);
		$format = $request->input('format', 'json');

		// check password
		//
		if ($password != env('APP_ADMIN_PASSWORD')) {
			return response("Unauthorized access. Please provide a valid password.", 401);
		}

		// get user accounts
		//
		$userAccounts = UserAccount::all();

		// filter user accounts
		//
		if ($option || $isAffiliate) {
			$userAccounts = $userAccounts->filter(function ($userAccount) use ($option, $isAffiliate) {
				$found = true;

				// apply filters
				//
				if ($option && !$userAccount->hasOption($option)) {
					$found = false;
				}
				if ($isAffiliate && !$userAccount->isAffiliate() == $isAffiliate) {
					$found = false;
				}

				return $found;
			})->values();
		}

		// collect user data
		//
		$userData = [];
		foreach ($userAccounts as $userAccount) {
			$user = User::find($userAccount->id);
			$person = Person::find($userAccount->id);

			// find all people that match this name
			//
			$person = Person::where('firstName', '=', $user->firstName)
				->where('lastName', '=', $user->lastName)
				->whereNotNull('aaid')->first();

			array_push($userData, [

				// contact info
				//
				'firstName' => $user->firstName,
				'lastName' => $user->lastName,
				'username' => $userAccount->username,
				'emailAddress' => $userAccount->email,
				'communities' => $user->communities,

				// research info
				//
				'researchSummary' => $person? $person->researchSummary : null,
				'researchTerms' => $person? $person->researchTerms : null,
				'researchInterests' => $person? $person->researchInterests : null,

				// academic info
				//
				'degreeInstitutionName' => $person? $person->degreeInstitutionName : null,
				'degreeYear' => $person? $person->degreeYear : null,
				'orcidId' => $person? $person->orcidId : null,
				'aaid' => $person? $person->aaid : null,

				// personal info
				//
				'homepage' => $person? $person->homepage : null,
				'socialUrl' => $person? $person->socialUrl : null,
				'githubUrl' => $person? $person->githubUrl : null
			]);
		}

		// sort user data by last name ascending
		//
		usort($userData, function($a, $b) {
    		return $a['lastName'] > $b['lastName'] ? 1 : -1;
		});

		// format data as a CSV
		//
		switch ($format) {

			// create csv file
			//
			case 'csv':
				$fileName = $option? $option . '.csv' : 'contact-info.csv';

				$headers = array(
					"Content-type"        => "text/csv",
					"Content-Disposition" => "attachment; filename=$fileName",
					"Pragma"              => "no-cache",
					"Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
					"Expires"             => "0"
				);

				$columns = [

					// contact info
					//
					'First name',
					'Last name',
					'Username',
					'Email address',
					'Communities',

					// research info
					//
					'Research summary',
					'Research terms',
					'Research interests',

					// academic info
					//
					'Degree institution name',
					'Degree year',
					'Orchid id',

					// web info
					//
					'Homepage',
					'Social url',
					'GitHub url',

					// label
					//
					'Contact label'];

				$callback = function() use($userData, $columns) {
					$file = fopen('php://output', 'w');
					fputcsv($file, $columns);

					foreach ($userData as $user) {

						// contact info
						//
						$row['First name'] = $user['firstName'];
						$row['Last name'] = $user['lastName'];
						$row['Username'] = $user['username'];
						$row['Email address'] = $user['emailAddress'];
						$row['Communities'] = $user['communities']? implode(', ', $user['communities']) : '';

						// research info
						//
						$row['researchSummary'] = $user['researchSummary'];
						$row['researchTerms'] = $user['researchTerms'];
						$row['researchInterests'] = $user['researchInterests'];

						// academic info
						//
						$row['degreeInstitutionName'] = $user['degreeInstitutionName'];
						$row['degreeYear'] = $user['degreeYear'];
						$row['orcidId'] = $user['orcidId'];

						// web info
						//
						$row['homepage'] = $user['homepage'];
						$row['socialUrl'] = $user['socialUrl'];
						$row['githubUrl'] = $user['githubUrl'];

						// label
						//
						$row['Contact label'] = 'Data Science Hub';

						fputcsv($file, array(

							// contact info
							//
							$row['First name'],
							$row['Last name'],
							$row['Username'],
							$row['Email address'],
							$row['Communities'],

							// research info
							//
							$row['researchSummary'],
							$row['researchTerms']? implode(', ', $row['researchTerms']) : '',
							$row['researchInterests']? implode(', ', $row['researchInterests']) : '',

							// academic info
							//
							$row['degreeInstitutionName'],
							$row['degreeYear'],
							$row['orcidId'],

							// personal info
							//
							$row['homepage'],
							$row['socialUrl'],
							$row['githubUrl'],

							// label
							//
							$row['Contact label']));
					}

					fclose($file);
				};

				$response = response()->stream($callback, 200, $headers);
				break;

			// create JSON object array
			//
			case 'json':
			default:
				$response = $userData;
				break;
		}

		return $response;
	}
}