---
title: "Skip Is Now Free and Open Source"
date:   2026-01-27
tags: [skip, open-source, licensing, announcement, sustainability, cross-platform]
layout: post
permalink: /blog/skip-is-free/
author: the Skip Team
draft: false
---

:::note[TL;DR]
Skip is now completely free and open source. [Become a sponsor](https://skip.dev/sponsor) to help sustain the future of truly native cross-platform development.
:::

Since launching Skip in 2023, we’ve pursued one mission: enable developers to create premium mobile apps for iOS and Android from a single Swift and SwiftUI codebase — without any of the compromises that have encumbered cross-platform development tools since, well, forever.

Over the past three years, Skip has evolved significantly. We started with a Swift-to-Kotlin transpiler and Android support for the most common SwiftUI APIs. We then founded the Swift Android Workgroup and released the Swift Android SDK to compile Swift natively for Android. We now have dozens of popular integration frameworks, interoperate with thousands of cross-platform Swift packages, and feature the most complete independent SwiftUI implementation available.

### The Challenge of Paid Developer Tools

Until today, Skip has required a paid subscription and license key to build apps. While free apps and indie developers below a revenue threshold were exempt, businesses were expected to subscribe. This model helped us bootstrap Skip without outside investment, but we’ve always known that to truly compete with legacy cross-platform tools and achieve widespread adoption, Skip would need to become freely available.

The plain truth is that developers expect to get their tools free of charge. First-party IDEs like Xcode and Android Studio, popular integration frameworks, and essential dev tools are all given away at no (direct) cost. The platform vendors monetize through developer program fees, app store commissions, and cloud services. Framework providers typically monetize through complementary services. But developer tools? Those have historically required the patronage of massive tech companies in order to fund their ongoing development, support, and infrastructure costs.

Beyond pricing, there’s a deeper concern about durability. Developers are understandably wary of building their entire app strategy on a small company’s paid, closed-source tool. What if the company goes under? Gets acquired and shut down? What happens to their apps? _We get it_. While Skip’s innate ejectability offers some risk mitigation, product teams need absolute confidence that their chosen technologies will be around next week, next year, and beyond. They must remain immune from the dreaded "rug pull" that so often accompanies a "pivot".

To keep the development community’s trust and achieve mass adoption, Skip needs a completely free and open foundation. Even if the core team disappeared, the community could continue supporting the technology and the apps that depend on it.

### What’s Changing

As of Skip 1.7, all licensing requirements have been removed. No license keys, no end-user license agreements, no trial or evaluation period.

- **Current Skip developers**: Your setup remains completely unchanged, except you will no longer need your license key after upgrading.
- **New Skip users**: You can start building immediately — no evaluation license required.
- **Open source skipstone**: We’ve open-sourced the skip tool (internally known as skipstone), which is the engine that powers Skip. This is the tool that handles all the critical build-time functionality: Project creation and management, Xcode and SwiftPM plugin logic, iOS-to-Android project transformation, resource and localization bundling, JNI bridge creation, source transpilation, app packaging, and project export. It is now available as a public GitHub repository at https://github.com/skiptools/skipstone under a free and open-source license.
- **Migrate the skip.tools site to skip.dev**: As part of this process, we are launching our new home at https://skip.dev! This new site hosts our documentation, blog, and case studies, and it is also open-source and welcomes contributions at https://github.com/skiptools/skip.dev. We will eventually be migrating the entirety of https://skip.tools to https://skip.dev.

### Supporting Skip’s Future

Since day one, Skip has been bootstrapped. We haven’t taken venture capital or private equity investment, nor are we controlled by big tech. This independence means we control our destiny and can make the best decisions for Skip’s developers and users — a unique position in the cross-platform development space.

But independence requires community support. And that is where you come in.

- **Current subscribers**: Your Small Business or Professional plan will automatically transition to an [Individual](https://skip.dev/sponsor) or [Supporter](https://skip.dev/sponsor) tier, respectively. You can cancel any time with no consequences (other than making us sad), but we hope you’ll consider staying on, at least throughout this transition period.
- **Individual developers**: If you believe in Skip’s mission, please consider supporting us through [GitHub Sponsors](https://github.com/sponsors/skiptools) with a monthly contribution.
- **Companies and organizations**: For businesses that want to see Skip flourish, we offer corporate sponsorship tiers with visibility on our homepage and in our documentation. Your sponsorship directly funds development of the integration frameworks essential to production apps, as well as the ongoing maintenance, support, and infrastructure. Sponsorship comes with some compelling perks! Please visit https://skip.dev/sponsor to see the sponsorship tiers.

Investing in Skip is also investing in your own team's capabilities and competitive advantage. Your support accelerates Skip's development and ensures its long-term success, enabling your developers to build exceptional native experiences efficiently, today and into the future.

### What Comes Next

We’re at a pivotal moment in the app development field. Legacy cross‑platform frameworks are struggling to keep pace with the rapid evolution of modern UI systems like Liquid Glass on iOS and Material Expressive on Android. The compromises that once felt acceptable in exchange for a unified codebase now result in dated interfaces, weaker user experiences, and real competitive disadvantages. Teams ready to move beyond those trade‑offs can count on Skip to champion what matters most: delivering truly native, uncompromised experiences on both major mobile platforms.

Opening Skip to the community marks the next step in its evolution. Software is never finished — especially a tool that supports modern Swift and Kotlin, SwiftPM and Gradle, Xcode and Android Studio, iOS and Android, and the ongoing growth of SwiftUI and Jetpack Compose. It’s a demanding pursuit, and we’re committed to it. But sustaining and expanding this work depends on the support of developers who believe in Skip’s mission.

Together, we will continue building toward Skip’s vision: a genuinely no‑compromise, cross‑platform foundation for universal mobile apps.

Thank you for your support, and as always, Happy Skipping!

---

**Ready to get started?** [Get started](/docs/gettingstarted) with Skip 1.7 today and join the community building the future of native cross-platform development.
