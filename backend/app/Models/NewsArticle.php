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

    // 公開中の記事（公開日時が現在以前）
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function isPublished(): bool
    {
        return $this->published_at !== null && $this->published_at->lessThanOrEqualTo(now());
    }
}
