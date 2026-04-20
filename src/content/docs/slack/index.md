---
layout: content
title: Slack Communities
permalink: /slack/
tableOfContents: false
comment: Go to https://skiptools.slack.com/admin/invites / Invite Links / Edit link settings to expire "never" to get a new link once the 400 invitations are used up.
---

<style>
.slack-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

@media (max-width: 720px) {
  .slack-grid {
    grid-template-columns: 1fr;
  }
}

.slack-card {
  border-radius: 12px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--sl-color-gray-5);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.slack-card:hover {
  border-color: var(--sl-color-gray-4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

:root[data-theme="dark"] .slack-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.slack-card--skip {
  background: color-mix(in srgb, var(--sl-color-accent) 6%, var(--sl-color-gray-7));
}

.slack-card--swift {
  background: color-mix(in srgb, #F05138 6%, var(--sl-color-gray-7));
}

.slack-card__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.slack-card__title {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--sl-color-white);
}

.slack-card__subtitle {
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--sl-color-gray-3);
}

.slack-card__desc {
  margin: 0 0 20px 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--sl-color-gray-2);
  flex-grow: 1;
}

.slack-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.slack-card__features li {
  font-size: 0.84rem;
  color: var(--sl-color-gray-3);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.slack-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  color: #fff;
  transition: filter 0.15s ease, transform 0.1s ease;
  align-self: flex-start;
}

.slack-card__btn:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
  color: #fff;
  text-decoration: none;
}

.slack-card__btn:active {
  transform: translateY(0);
}

.slack-card__btn--skip {
  background-color: var(--sl-color-accent);
}

.slack-card__btn--swift {
  background-color: #F05138;
}
</style>

Connect with other developers building cross-platform apps with Skip and Swift for Android.

<div class="slack-grid">
  <div class="slack-card slack-card--skip">
    <svg class="slack-card__icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.2 60.2c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10h10v10zm5 0c0-5.5 4.5-10 10-10s10 4.5 10 10v25c0 5.5-4.5 10-10 10s-10-4.5-10-10V60.2z" fill="#36C5F0"/>
      <path d="M39.8 22.2c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10v10h-10zm0 5c5.5 0 10 4.5 10 10s-4.5 10-10 10H14.8c-5.5 0-10-4.5-10-10s4.5-10 10-10h25z" fill="#2EB67D"/>
      <path d="M77.8 39.8c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10h-10V39.8zm-5 0c0 5.5-4.5 10-10 10s-10-4.5-10-10V14.8c0-5.5 4.5-10 10-10s10 4.5 10 10v25z" fill="#ECB22E"/>
      <path d="M60.2 77.8c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10v-10h10zm0-5c-5.5 0-10-4.5-10-10s4.5-10 10-10h25c5.5 0 10 4.5 10 10s-4.5 10-10 10H60.2z" fill="#E01E5A"/>
    </svg>
    <div class="slack-card__title">Skip Slack</div>
    <div class="slack-card__subtitle">skiptools.slack.com</div>
    <p class="slack-card__desc">The home of the Skip developer community. Get help with Skip Lite and Skip Fuse, share what you're building, and stay up to date on releases and announcements.</p>
    <ul class="slack-card__features">
      <li><span>🛠</span> Real-time technical support</li>
      <li><span>💡</span> Share ideas &amp; feedback</li>
      <li><span>🚀</span> Project updates &amp; announcements</li>
    </ul>
    <a href="https://join.slack.com/t/skiptools/shared_invite/zt-3noca6hj8-1hsjkUGodwhVKxI41BX_Fw" class="slack-card__btn slack-card__btn--skip">
      Join Skip Slack
    </a>
  </div>
  <div class="slack-card slack-card--swift">
    <svg class="slack-card__icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.2 60.2c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10h10v10zm5 0c0-5.5 4.5-10 10-10s10 4.5 10 10v25c0 5.5-4.5 10-10 10s-10-4.5-10-10V60.2z" fill="#36C5F0"/>
      <path d="M39.8 22.2c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10v10h-10zm0 5c5.5 0 10 4.5 10 10s-4.5 10-10 10H14.8c-5.5 0-10-4.5-10-10s4.5-10 10-10h25z" fill="#2EB67D"/>
      <path d="M77.8 39.8c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10h-10V39.8zm-5 0c0 5.5-4.5 10-10 10s-10-4.5-10-10V14.8c0-5.5 4.5-10 10-10s10 4.5 10 10v25z" fill="#ECB22E"/>
      <path d="M60.2 77.8c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10v-10h10zm0-5c-5.5 0-10-4.5-10-10s4.5-10 10-10h25c5.5 0 10 4.5 10 10s-4.5 10-10 10H60.2z" fill="#E01E5A"/>
    </svg>
    <div class="slack-card__title">Swift Open Source Slack</div>
    <div class="slack-card__subtitle">swift-open-source.slack.com &middot; #android</div>
    <p class="slack-card__desc">General support and discussion for the Swift SDK for Android. Join the <strong>#android</strong> channel for questions about the Swift Android toolchain, platform APIs, cross-compilation, and native Swift development on Android.</p>
    <ul class="slack-card__features">
      <li><span>📱</span> Swift SDK for Android</li>
      <li><span>🔧</span> Toolchain &amp; cross-compilation</li>
      <li><span>🌐</span> Broader Swift open-source community</li>
    </ul>
    <a href="https://swift-open-source.slack.com/join/shared_invite/zt-2kilwxbt3-mYT8jVt0sYtEK6N01BRedg#/shared-invite/email" class="slack-card__btn slack-card__btn--swift">
      Join Swift Open Source Slack
    </a>
  </div>
</div>
