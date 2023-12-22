<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['feed', 'notification', 'email'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
