<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            // 重要な告知（メンテナンス・価格改定など）はホームの上部に帯で表示する
            $table->boolean('is_important')->default(false)->after('published_at');
        });
    }

    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropColumn('is_important');
        });
    }
};
