<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TutorialProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_have_tutorial_enabled_by_default(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Tutorial Tester',
            'email' => 'tutorial-tester@example.com',
            'password' => 'password123',
        ])->assertCreated();

        $this->assertTrue($response->json('user.tutorial_enabled'));
    }

    public function test_progress_is_recorded_once_per_step(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/tutorial/progress', ['step' => 'viewed_product'])->assertOk();
        $this->postJson('/api/tutorial/progress', ['step' => 'viewed_product'])->assertOk();
        $this->postJson('/api/tutorial/progress', ['step' => 'added_to_cart'])
            ->assertOk()
            ->assertJsonPath('tutorial_progress', ['viewed_product', 'added_to_cart']);
    }

    public function test_unknown_steps_are_rejected(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/tutorial/progress', ['step' => 'hacked'])->assertUnprocessable();
    }

    public function test_anonymous_users_cannot_record_progress(): void
    {
        $this->postJson('/api/tutorial/progress', ['step' => 'viewed_product'])->assertUnauthorized();
    }

    public function test_profile_returns_progress_and_setting(): void
    {
        $user = User::factory()->create([
            'tutorial_enabled' => false,
            'tutorial_progress' => ['viewed_guide'],
        ]);
        Sanctum::actingAs($user);

        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('tutorial_enabled', false)
            ->assertJsonPath('tutorial_progress', ['viewed_guide']);
    }
}
