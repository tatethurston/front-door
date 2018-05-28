const { TWILIO_SID, TWILIO_TOKEN } = process.env;

import * as qs from 'qs';
const twilio = require("twilio");
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

export const handler = async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { RecordingUrl } = qs.parse(event.body);

  try {
    await client.messages.create({
      body: `I'm letting someone in. Here's the recording link: ${RecordingUrl}`,
      from: "+16505130122",
      to: "+16505764285"
    });
  } catch (e) {
    console.log(e);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w9"/>
      </Response>
    `.trim()
  };
};
