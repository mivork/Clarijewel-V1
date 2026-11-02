<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'published_at',
        'is_important',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_important' => 'boolean',
        ];
    }
}
