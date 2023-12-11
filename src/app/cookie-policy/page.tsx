import React from "react";
import { Metadata } from "next";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";

export const metadata: Metadata = {
  title: "Cookie policy",
};

const Page = () => {
  return (
    <div className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset md:w-[70vw] mx-auto mb-20">
      <MarkDownRenderer
        markdown={`
# Cookie Policy for Hack Kosice Application portal

*Last Updated: 11 December 2023*

## 1. What Are Cookies?
Cookies are small text files placed on your device to collect standard Internet log information and visitor behavior information. When you visit our websites, we may collect information from you automatically through cookies or similar technology.

## 2. How Do We Use Cookies?
Hack Kosice Application portal uses cookies in a range of ways to improve your experience on our website, including:

- Keeping you signed in
- Remembering your cookie preferences
- Understanding how you use our website
- Enhancing site performance and functionality

## 3. What Types of Cookies Do We Use?
There are several different types of cookies our website may use:

- Functional Cookies: These cookies are essential for the website to function and cannot be switched off in our systems. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.
- Performance and Analytics Cookies: These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site and understand user behaviour. They help us know which pages are the most and least popular and see how visitors move around and interact with the site.

## 4. How to Manage Cookies
You can set your browser not to accept cookies, and the website [www.allaboutcookies.org](https://www.allaboutcookies.org) explains how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.

## 5. Privacy Policies of Performance and Analytics Cookie providers

- Sentry: [sentry.io/privacy/](https://sentry.io/privacy/)
- Datadog: [www.datadoghq.com/privacy/](https://www.datadoghq.com/privacy/)

## 6. Changes to Our Cookie Policy
Hack Kosice Application portal keeps its cookie policy under regular review and places any updates on this web page.

## 7. How to Contact Us
If you have any questions about Hack Kosice Application portal's cookie policy, please do not hesitate to contact us at contact@hackslovakia.com`}
      />
    </div>
  );
};

export default Page;
