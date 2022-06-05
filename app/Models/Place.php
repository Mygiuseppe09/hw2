<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Place extends Model
{
    public $timestamps = false;
    public $incrementing = false;

    public function visits(): BelongsToMany {
        return $this -> belongsToMany(
            'App\Models\User','visits',
            'place','user'
        );
    }

    public function posts(): HasMany {
        return $this -> hasMany('App\Models\Post');
    }

    protected $fillable = [
        'id',
        'name'
    ];



}
