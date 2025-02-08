"use client";

import { datadogRum } from "@datadog/browser-rum";
import { CoralogixRum } from "@coralogix/browser";
import * as Sentry from "@sentry/react";

import { useEffect } from "react";

export const ClientProvider = () => {
  useEffect(() => {
    datadogRum.init({
      applicationId: process.env.datadogApplicationId,
      clientToken: process.env.datadogClientToken,
      // `site` refers to the Datadog site parameter of your organization
      // see https://docs.datadoghq.com/getting_started/site/
      site: "us5.datadoghq.com",
      service: "soccer-app",
      env: "prod",
      // Specify a version number to identify the deployed version of your application in Datadog
      // version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      defaultPrivacyLevel: "mask-user-input",
    });


    Sentry.init({
      dsn: process.env.sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });
  }, []);

  return null;
};
