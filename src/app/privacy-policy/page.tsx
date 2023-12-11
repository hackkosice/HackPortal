import React from "react";
import { Metadata } from "next";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";

export const metadata: Metadata = {
  title: "Privacy policy",
};

const Page = () => {
  return (
    <div className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset md:w-[70vw] mx-auto mb-20">
      <MarkDownRenderer
        markdown={`
# Privacy policy

*Last Updated: 11 December 2023*

This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service. We will not use or share your information with anyone except as described in this Privacy Policy.

Hack Slovakia – “us”, “we”, or “our” – operates Hack Slovakia (the “service”).

We use your personal information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.

## Information collection and use
While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, phone number, address, and other information (“Personal Information”).

We store information for 3 years and then keep it in anonymised version, or until you decide to delete your information.

Major League Hacking (MLH) is the official student hackathon league. By using the Service, you authorize us to share your application/registration information for event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the MLH Privacy Policy. You further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.

## Accessing, changing and removing your information
It is your legal right to view all information collected about you by us. To access, change or delete information about you, please contact us anytime at contact@hackslovakia.com.

## Sponsors
We wouldn’t be able to organize the Hack Kosice hackathon and other events without the help from our sponsors. Sponsors, in exchange, will have access to the CV and other information you provide us. We, or our partners, may perform processing on and make use of the data within the CV you have submitted for recruiting purposes, for example to send you a job offer.

## Media and publicity
We take and publish photos throughout the hackathon and other events organised by us. You may appear on some of these photos. We aim to publish photos that show everyone at their best, but there might be a few that you don’t like. If you see a photo like this, let us know so that we can try to take it down — but be aware that it is difficult to completely erase a photo from all media channels.

These images will be used to share news about the Hack Kosice hackathon and other events, and to publicise our future events. Images may be used in press releases, printed publicity and published on our social media. If you would like to see your images or would like us to delete them, please write email to contact@hackslovakia.com.

We will publish the names of the winners and the winning hacks. We may publish other content associated with this, such as videos of the winners presenting.

## Running the event
When you apply to the event, we collect information about you that is necessary for running the event, including your first name, last name, date of birth, email, phone number, age, gender, institution, study level, major, graduation year, shirt size, dietary restrictions, and any special needs you have entered on your profile. When you give us your consent we will also collect optional data, e.g. your CV. During the application process, we also collect your submissions to the questions we ask, including information about your interests, and the country you are travelling from. We store your RSVP status and your attendee status. We use this information for running the Service and for sharing anonymised aggregate data with media organisations for the purposes of promoting Hack Kosice and other events.

We may share anonymised data about your dietary requirements with third parties for catering purposes.

## Code of Conduct
By participating at any events organised by Hack Slovakia, or events related to Hack Slovakia organised by our partners, you agree to follow the MLH Code of Conduct. This extends to all attendees, including hackers, volunteers, organizers, sponsors, partners, judges, mentors, and MLH staff.

## Log data
We collect information that your browser sends whenever you visit or interact with our Service (“Log Data”). This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.

## Analytics providers

We use third-party Service Providers to monitor and analyze the use of our Service. Specifically for analytics providers, we use Datadog and Sentry.

### Datadog

Datadog is a monitoring service provided by Datadog, Inc. We use Datadog to monitor the performance of our Service. The user is identified by a cookie and the following usage data is collected: IP address, browser information (browser type, OS, language), device information (device type, screen resolution), the date and time of the visit, your user session or other custom data relevant for the given interaction.
The data is tracked only after you consent to using the Performance and Analytics Cookies (for more information about cookies see our [Cookie Policy](/cookie-policy)).
For more information on what data Datadog collects for what purposes and how you can control the data sent to Datadog, please see their privacy policy: [www.datadoghq.com/privacy/](https://www.datadoghq.com/privacy/).

### Sentry

Sentry is an error monitoring service provided by Functional Software, Inc. We use Sentry to monitor and report errors that occur on our Service. The user is identified by a cookie and the following usage data is collected: IP address, browser information (browser type, OS, language), device information (device type, screen resolution), the date and time of the visit. The data is tracked only after you consent to using the Performance and Analytics Cookies (for more information about cookies see our [Cookie Policy](/cookie-policy)).
For more information on what data Sentry collects for what purposes and how you can control the data sent to Sentry, please see their privacy policy: [sentry.io/privacy/](https://sentry.io/privacy/).

## Cookies
Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer’s hard drive.

For more information visit our [Cookie Policy](/cookie-policy).

## Service providers
We may employ third party companies and individuals, to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analysing how our Service is used.

These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

## Compliance with laws
We will disclose your Personal Information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement or to protect the security or integrity of our Service.

## Security
The security of your Personal Information is important to us, but be aware that no method of transmission over the Internet, or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.

## International transfer
We have hired technology service providers located in countries that do not have a data protection regulation equivalent to the European (“Third Countries”). These service providers have signed the confidentiality and data processing agreements required by the regulation, which apply the warranties and safeguards needed to preserve your privacy.

Your information, including Personal Information, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.

## Changes to this privacy policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`}
      />
    </div>
  );
};

export default Page;
