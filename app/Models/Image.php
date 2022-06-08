<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Image extends Model
{
    protected $connection = 'mongodb';
    public $timestamps = false;
    protected $primaryKey = "postId";
    public $incrementing = false;

    protected $fillable = [
        'postId',
        'images'
    ];


}
