<?php

namespace Tests\Feature;

use App\Models\NewsArticle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsPublishingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_list_shows_only_published_articles(): void
    {
        $past = NewsArticle::create(['title' => '公開済み', 'body' => 'x', 'published_at' => now()->subDay()]);
        $future = NewsArticle::create(['title' => '予約中', 'body' => 'x', 'published_at' => now()->addDays(3)]);
        $draft = NewsArticle::create(['title' => '未公開', 'body' => 'x', 'published_at' => null]);

        $titles = collect($this->getJson('/api/news')->assertOk()->json())->pluck('title');

        $this->assertTrue($titles->contains('公開済み'));
        $this->assertFalse($titles->contains('予約中'));
        $this->assertFalse($titles->contains('未公開'));
    }

    public function test_public_detail_is_not_found_for_scheduled_articles(): void
    {
        $future = NewsArticle::create(['title' => '予約中', 'body' => 'x', 'published_at' => now()->addDays(3)]);

        $this->getJson('/api/news/'.$future->id)->assertNotFound();
    }

    public function test_public_detail_is_found_for_published_articles(): void
    {
        $past = NewsArticle::create(['title' => '公開済み', 'body' => 'x', 'published_at' => now()->subDay()]);

        $this->getJson('/api/news/'.$past->id)->assertOk()->assertJsonPath('title', '公開済み');
    }
}
