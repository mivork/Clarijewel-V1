<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 新規登録後にチュートリアルを表示するか（既定はオン。閉じると自動でオフになる）
            $table->boolean('tutorial_enabled')->default(true)->after('marketing_opt_in');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('tutorial_enabled');
        });
    }
};
