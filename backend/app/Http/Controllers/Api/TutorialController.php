<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    // 達成できる項目（フロントの表示名と対応する）
    public const STEPS = [
        'viewed_product',
        'viewed_guide',
        'viewed_news',
        'viewed_verify',
        'added_to_wishlist',
        'added_to_cart',
    ];

    // 達成した項目を記録する（同じ項目は重複させない）
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'step' => ['required', 'string', 'in:' . implode(',', self::STEPS)],
        ]);

        $user = $request->user();
        $progress = collect($user->tutorial_progress ?? [])
            ->push($validated['step'])
            ->unique()
            ->values()
            ->all();

        $user->update(['tutorial_progress' => $progress]);

        return response()->json(['tutorial_progress' => $progress]);
    }
}
