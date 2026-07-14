#!/usr/bin/env python3
import sys, json, asyncio, os, traceback

async def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        session_id = data.get('session_id', 'default')
        system_message = data.get('system_message', 'You are a helpful AI assistant.')
        user_text = data.get('message', '')
        provider = data.get('provider', 'openai')
        model = data.get('model', 'gpt-4o-mini')
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            print(json.dumps({'error': 'EMERGENT_LLM_KEY not set'}))
            return
        chat = LlmChat(api_key=api_key, session_id=session_id, system_message=system_message).with_model(provider, model)
        response = await chat.send_message(UserMessage(text=user_text))
        print(json.dumps({'response': str(response)}))
    except Exception as e:
        print(json.dumps({'error': f'{type(e).__name__}: {e}', 'trace': traceback.format_exc()}))

if __name__ == '__main__':
    asyncio.run(main())
