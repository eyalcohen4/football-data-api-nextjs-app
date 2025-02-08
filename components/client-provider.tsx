"use client";

import { datadogRum } from "@datadog/browser-rum";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { DocumentLoad } from "@opentelemetry/plugin-document-load";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

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


        const provider = new WebTracerProvider({
          spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
        });

        provider.register({
          // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
          contextManager: new ZoneContextManager(),
        });

        // Registering instrumentations / plugins
        registerInstrumentations({
          instrumentations: [new DocumentLoad()],
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
