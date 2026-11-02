<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\JsonResponse;

class NewsArticleController extends Controller
{
    // 公開中（公開日時が過去）の記事だけを返す。予約投稿は公開日時になるまで見せない
    public function index(): JsonResponse
    {
        return response()->json(
            NewsArticle::published()->orderByDesc('published_at')->get()
        );
    }

    public function show(NewsArticle $newsArticle): JsonResponse
    {
        abort_unless($newsArticle->isPublished(), 404);

        return response()->json($newsArticle);
    }
}
