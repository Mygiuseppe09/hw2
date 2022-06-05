<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    public $timestamps = false;


    public function users(): BelongsTo {
        return $this -> belongsTo('App\Models\User','user');
    }

    public function places(): BelongsTo {
        return $this -> belongsTo('App\Models\Place','place');
    }

    public function likes(): BelongsToMany {
        return $this -> belongsToMany(
            'App\Models\User','likes',
            'post','user'
        );
    }

    protected $fillable = [
        'user',
        'place'
    ];


}
