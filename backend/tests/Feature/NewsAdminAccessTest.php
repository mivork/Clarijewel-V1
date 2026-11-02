<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NewsAdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_anonymous_cannot_manage_news(): void
    {
        $this->getJson('/api/admin/news')->assertUnauthorized();
        $this->postJson('/api/admin/news', ['title' => 'x', 'body' => 'x'])->assertUnauthorized();
    }

    public function test_member_cannot_manage_news(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => false]));

        $this->getJson('/api/admin/news')->assertForbidden();
        $this->postJson('/api/admin/news', ['title' => 'x', 'body' => 'x'])->assertForbidden();
    }

    public function test_admin_can_create_news_with_thumbnail_and_important_flag(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));

        $this->postJson('/api/admin/news', [
            'title' => '重要なお知らせ',
            'body' => '## 見出し',
            'published_at' => now()->subHour()->toIso8601String(),
            'is_important' => true,
            'thumbnail_url' => 'https://example.com/news.jpg',
        ])->assertCreated()
            ->assertJsonPath('is_important', true)
            ->assertJsonPath('thumbnail_url', 'https://example.com/news.jpg');
    }

    public function test_admin_rejects_non_url_thumbnail(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));

        $this->postJson('/api/admin/news', [
            'title' => 'x',
            'body' => 'x',
            'thumbnail_url' => 'not a url',
        ])->assertUnprocessable();
    }
}
