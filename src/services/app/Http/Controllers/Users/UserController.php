<?php
/******************************************************************************\
|                                                                              |
|                              UserController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' authentication information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2020, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Accounts\PasswordReset;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;
use App\Utilities\Filters\DateFilters;
use App\Utilities\Filters\LimitFilter;

class UserController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User
	 */
	public function postCreate(Request $request) {

		// create new user
		//
		$user = new User([
			'id' => Guid::create(),
			'first_name' => $request->input('first_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name'),
			'country' => $request->input('country')
		]);

		// create new user account
		//
		$userAccount = new UserAccount([
			'id' => $user->id,
			'username' => $request->input('username'),
			'password' => $request->input('password'),
			'enabled_flag' => 1,
			'email' => $request->input('email'),
			'email_verified_flag' => 0,
			'admin_flag' => 0,
		]);

		// check if user account is valid (if username
		// and email address are not already taken).
		//
		$errors = [];
		if (!$userAccount->isTaken($errors)) {
			return response(json_encode($errors), 409);
		}

		// add new user
		//
		$user->save();
		$userAccount->add();

		return $user;
	}

	//
	// querying methods
	//

	/**
	 * Get the current user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getCurrent(Request $request) {

		// get current user id
		//
		$id = Session::get('user_id');

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}
		
		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by username.
	 *
	 * @param string $username - the username of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByUsername(string $username) {

		// get user's account
		//
		$userAccount = UserAccount::byUsername($username)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the username: " . $username, 404);
		}

		// find user by id
		//
		$user = User::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by email address.
	 *
	 * @param string $email - the email of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByEmail(string $email) {

		// get user's account
		//
		$userAccount = UserAccount::byEmail($email)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the email address: " . $email, 404);
		}

		// find user by id
		//
		$user = User::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get all users.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getAll(Request $request) {
		
		// create query
		//
		$query = User::orderBy('created_at', 'DESC');

		// add filters
		//
		$query = DateFilters::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// execute query
		//
		return $query->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user account by id
		//
		$userAccount = UserAccount::find($id);
		if (!$userAccount) {
			return response("User account not found.", 404);
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// update user account
		//
		$userAccount->change([
			'username' => $request->input('username'),
			'email' => $request->input('email')
		]);

		// update user
		//
		return $user->change([
			'first_name' => $request->input('first_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name'),
			'country' => $request->input('country')
		]);
	}

	/**
	 * Update all users.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User[]
	 */
	public function updateAll(Request $request) {

		// get params
		//
		$input = $request->all();

		// update all users
		//
		$collection = collect();
		for ($i = 0; $i < sizeOf($input); $i++) {
			UsersController::updateIndex($item[$i]['id']);	
		}
		return $collection;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user.
	 *
	 * @param string $id - the id of the user to delete
	 * @return App\Models\Users\User
	 */
	public function deleteIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// delete user from database and file system
		//
		$user->delete();

		// destroy session cookies
		//
		Session::flush();

		return $user;
	}
}