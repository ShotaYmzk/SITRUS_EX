"""Anthropic API 動作確認スクリプト"""
import getpass
import sys

try:
    import anthropic
except ImportError:
    print("anthropicライブラリが見つかりません。インストールします...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "anthropic"])
    import anthropic

def main():
    print("=== Anthropic API 動作確認 ===\n")
    api_key = getpass.getpass("APIキーを入力してください (入力は非表示): ")

    if not api_key.strip():
        print("エラー: APIキーが入力されていません")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key.strip())

    print("\nAPIに接続中...")
    try:
        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=64,
            messages=[{"role": "user", "content": "日本語で「APIは正常に動作しています」と答えてください。"}],
        )
        reply = next((b.text for b in response.content if b.type == "text"), "")
        print(f"\n✅ 成功！\nモデル: {response.model}\n応答: {reply}")
        print(f"\n使用トークン: 入力={response.usage.input_tokens}, 出力={response.usage.output_tokens}")
    except anthropic.AuthenticationError:
        print("\n❌ 認証エラー: APIキーが無効です")
        sys.exit(1)
    except anthropic.PermissionDeniedError:
        print("\n❌ 権限エラー: このAPIキーは必要な権限を持っていません")
        sys.exit(1)
    except anthropic.RateLimitError:
        print("\n❌ レート制限: しばらく待ってから再試行してください")
        sys.exit(1)
    except anthropic.APIConnectionError:
        print("\n❌ 接続エラー: インターネット接続を確認してください")
        sys.exit(1)
    except anthropic.APIStatusError as e:
        print(f"\n❌ APIエラー (HTTP {e.status_code}): {e.message}")
        sys.exit(1)

if __name__ == "__main__":
    main()
