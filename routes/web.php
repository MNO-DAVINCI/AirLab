<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Routes for Uhoo API
Route::get('uhoo/data', 'ApiController@getUhooData');
Route::get('uhoo/trans/{data}', 'ApiController@transferUhooData');
Route::post('uhoo/data/post', 'ApiController@storeUhooData');