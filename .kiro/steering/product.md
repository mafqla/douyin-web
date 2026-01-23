# Product Overview

This is a TikTok-inspired full-stack application built as a monorepo with three main sub-applications:

## Applications

### douyin-portal (User Portal) - 50% Complete

The main user-facing application for consuming video content. Features video playback, social interactions (likes, comments, shares), user profiles, discovery feeds, search, and messaging. Uses real TikTok API integration (see: https://github.com/mafqla/douyin-api).

### douyin-creator (Creator Platform) - 10% Complete

Content creator dashboard for managing videos, analytics, and monetization. Includes video upload/publishing, content management, data visualization, live streaming management, and revenue tracking. UI mostly complete, backend integration pending.

### douyin-admin (Admin Dashboard) - 10% Complete

Administrative backend for platform management. Features RBAC permissions, user management, content moderation, system monitoring, and data analytics. UI mostly complete, backend integration pending.

### api-docs (API Documentation)

Interactive API documentation and testing interface built with React and shadcn/ui.

## Key Features

- Video streaming with xgplayer (portal)
- Real-time data visualization with G2/BizCharts
- Multi-modal video playback (basic, mini, modal, swipe)
- Social features (follow, like, comment, share)
- Content management and moderation
- Analytics dashboards
