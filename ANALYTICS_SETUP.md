# Analytics Setup for HappyVibe

## Overview

HappyVibe collects anonymous usage data to help improve the app. By default, analytics are sent to a placeholder PostHog account, but you can easily configure it to send data to **your own PostHog account**.

## Quick Setup

###1. Create a PostHog Account (Free)

1. Go to [https://posthog.com](https://posthog.com)
2. Sign up for a free account
3. Create a new project called "HappyVibe"
4. Copy your **Project API Key** (starts with `phc_`)

### 2. Configure Environment Variables

Add your PostHog API key to the `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your PostHog API key
VITE_POSTHOG_API_KEY=phc_YOUR_API_KEY_HERE
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

### 3. Rebuild the App

```bash
# Rebuild to include your new analytics configuration
npm run tauri build
```

That's it! Now all usage data will be sent to **your** PostHog account.

## What Data is Collected?

HappyVibe collects **anonymous** usage data only:

✅ **Collected:**
- Feature usage (which tools you use)
- Performance metrics (app speed)
- Error reports (to fix bugs)
- Session duration and frequency
- Screen navigation patterns

❌ **NOT Collected:**
- Personal information (names, emails, etc.)
- File contents or code
- API keys or credentials
- Project paths (sanitized to `/***`)
- Any identifiable information

## Privacy Features

- **Anonymous by default** - Random user IDs only
- **No session recording** - We don't record your screen
- **PII sanitization** - File paths, emails, and API keys are automatically removed
- **User control** - Analytics can be disabled anytime in Settings
- **GDPR compliant** - Full data deletion on request

## Disable Analytics

Users can disable analytics at any time:

1. Open HappyVibe Settings
2. Navigate to "Privacy & Analytics"
3. Toggle "Enable Analytics" OFF

Or delete all collected data:

1. Settings → Privacy & Analytics
2. Click "Delete All Data"
3. Confirm deletion

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_POSTHOG_API_KEY` | Your PostHog Project API Key | opcode default |
| `VITE_POSTHOG_HOST` | PostHog server hostname | `https://us.i.posthog.com` |

## Testing Analytics

To verify analytics are working:

```bash
# Enable debug mode
VITE_POSTHOG_DEBUG=true npm run tauri dev

# Check browser console for PostHog events
```

## For Distributors

If you're distributing HappyVibe to users:

1. **Create your own PostHog account** (free tier supports 1M events/month)
2. **Set environment variables** during build:
   ```bash
   VITE_POSTHOG_API_KEY=your_key npm run tauri build
   ```
3. **Document privacy policy** in your distribution

## PostHog Dashboard

Once configured, you can view analytics at:

```
https://app.posthog.com/project/YOUR_PROJECT_ID/dashboard
```

Useful dashboards to create:
- **Feature Usage**: Which MCP tools are most popular?
- **Performance**: Are there slow operations?
- **Errors**: Which errors occur most frequently?
- **Retention**: How often do users return?

## Compliance

HappyVibe's analytics system is designed to comply with:

- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **Privacy Shield** frameworks

Users have full control over:
- ✅ Opt-in/opt-out consent
- ✅ Data deletion requests
- ✅ Transparency about data collection

## Advanced Configuration

### Custom PostHog Server

If you're self-hosting PostHog:

```bash
VITE_POSTHOG_API_KEY=your_key
VITE_POSTHOG_HOST=https://your-posthog-server.com
```

### Disable Analytics Entirely

To build without analytics:

1. Remove PostHog API key from `.env`
2. The app will fall back to disabled analytics
3. Users won't see the consent dialog

## Support

Questions about analytics setup?

- 📧 Open an issue on GitHub
- 📖 Read PostHog docs: https://posthog.com/docs
- 💬 Check the privacy policy

---

**Remember:** Analytics help make HappyVibe better for everyone. By sending data to your own account, you can track your own usage patterns and contribute to improving the app!
