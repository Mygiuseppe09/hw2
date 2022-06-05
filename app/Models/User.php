<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models;
use Illuminate\Database\Query\Builder;


/**
 * @mixin Builder
 * @package App
 */


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /* Una classe ORM si aspetta che la chiave primaria sia:
       NUMERICA, AUTO-INCREMENT e si chiami ID */

    protected $keyType = "string";
    protected $primaryKey = "username";
    public $incrementing = false;

    public $timestamps = false;

    public function posts(): HasMany
    {
        /* 1-N */
        return $this -> hasMany('App\Models\Post');
    }

    public function visits(): BelongsToMany {
        return $this -> belongsToMany(
            'App\Models\Place','visits',
            'user','place'
        );
    }

    public function likes(): BelongsToMany {
        return $this -> belongsToMany(
            'App\Models\Post','likes',
            'user','post'
        );
    }


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'surname',
        'date_of_birth',
        'gender'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password'
    ];


}
