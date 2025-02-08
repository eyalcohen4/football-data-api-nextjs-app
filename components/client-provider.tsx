"use client";

import { datadogRum } from "@datadog/browser-rum";
import {
  SimpleSpanProcessor,
  WebTracerProvider
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

import * as Sentry from "@sentry/react";

const {
  getWebAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-web");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { B3Propagator } = require("@opentelemetry/propagator-b3");

import { useEffect } from "react";

export const ClientProvider = () => {
  useEffect(() => {
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

    const exporter = new CollectorTraceExporter({
      serviceName: "auto-instrumentations-web",
    });

    const provider = new WebTracerProvider();
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({
      contextManager: new ZoneContextManager(),
      propagator: new B3Propagator(),
    });

    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          // load custom configuration for xml-http-request instrumentation
          "@opentelemetry/instrumentation-xml-http-request": {
            clearTimingResources: true,
          },
        }),
      ],
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
