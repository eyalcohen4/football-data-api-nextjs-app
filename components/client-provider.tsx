// @ts-nocheck
"use client";

import { datadogRum } from "@datadog/browser-rum";

import * as Sentry from "@sentry/react";

import { BatchSpanProcessor, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";


import { useEffect } from "react";

export const ClientProvider = () => {
  useEffect(() => {
    const tracerProvider = new WebTracerProvider({
      resource: {
        attributes: {
          // TODO update these values with ones that make sense for your application
          [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: "production",
          [ATTR_SERVICE_NAME]: "my-website",
          [ATTR_SERVICE_VERSION]: "1.0.0",
        },
      },
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: "https://ingress.us-west-2.aws.dash0.com/v1/traces",
            headers: {
              // TODO we **highly** recommend that you use an auth token with restricted permissions for
              // in-browser telemetry collection. Within the auth token settings screen, you can restrict
              // an auth token to a single dataset and **only ingesting** permissions.
              Authorization: "Bearer auth_n6HvdC5982H9FhFGJnnk8Kanam2D0NlF",
            },
          }),
          {
            maxQueueSize: 100, // The maximum queue size. After the size is reached, spans are dropped.
            maxExportBatchSize: 10, // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
            scheduledDelayMillis: 500, // The interval between two consecutive exports
            exportTimeoutMillis: 30000, // How long the export can run before it is cancelled
          }
        ),
      ],
    });
    
    tracerProvider.register({
      // Changing default context manager to use ZoneContextManager. This one supports tracking of asynchronous operations.
      // Optional, but recommended for better correlation.
      contextManager: new ZoneContextManager(),
    });
    
    // Registering instrumentations
    registerInstrumentations({
      instrumentations: [
        // You can configure all the auto-instrumentations via this function's parameter.
        // Learn more via this documentation: https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-web
        getWebAutoInstrumentations(),
      ],
    });
    

    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
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
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        // Sentry.replayIntegration({
        //   maskAllText: true,
        //   blockAllMedia: true,
        // }),
      ],
    });
  }, []);

  return null;
};
