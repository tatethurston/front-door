const {
  TWILIO_SID,
  TWILIO_TOKEN,
  ACCESS_CODE,
} = process.env;

import * as qs from 'qs';
import * as twilio from "twilio";
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

export const handler = async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { Digits } = qs.parse(event.body);
  console.log(`Received code ${Digits}`);

  if (Digits != ACCESS_CODE) {
     return {
       statusCode: 200,
       headers: { "Content-Type": "text/xml" },
       body: `
         <?xml version="1.0" encoding="UTF-8"?>
         <Response>
           <Say>Sorry, I don't recognize that code. Please try again.</Say>
         </Response>
       `.trim()
     };
  }

  try {
    await client.messages.create({
      body: `I'm letting someone in. Their access code was ${Digits}`,
      from: "+16505130122",
      to: "+16505764285"
    });
  } catch (e) {
    console.error(e);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Thanks. I'm buzzing you in now.</Say>
        <Play digits="w9"/>
      </Response>
    `.trim()
  };
};
