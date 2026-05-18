<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();
        Log::info($input['name']);
        return User::create([
            'name' => $input['name'],
            'username' => $this->generateUniqueUsername($input['name']),
            'email' => $input['email'],
            'password' => $input['password'],
        ]);
    }

    /**
     * Generate unique username.
     */
    protected function generateUniqueUsername(string $name): string
    {
        $username = Str::slug($name, '');
        $original = $username;
        $count = 1;

        while (User::where('username', $username)->exists()) {
            $username = $original . $count;
            $count++;
        }

        return $username;
    }
}