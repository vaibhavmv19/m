# Netflix Mobile Login - Manus Deployment

This is the fixed Netflix mobile login app that works with the Flask proxy.

## Features

- Opens Netflix x_l1 PC login links in iframe
- Desktop mode (1280px) initially
- Auto-switches to mobile mode after Netflix loads
- Works with Telegram WebApp
- Handles ERR_BLOCKED_BY_RESPONSE by routing through proxy

## Deployment

Deploy to Manus as a static site. Set WEBAPP_URL in bot to this domain.

## Usage

```
https://your-manus-domain.com/?url=<netflix_x_l1_link>
```

The app will:
1. Load Netflix in desktop mode (1280px viewport)
2. Detect when Netflix loads
3. Switch to mobile mode (100% viewport)
4. User can interact normally

## No Changes

This code is deployed as-is without any modifications.
