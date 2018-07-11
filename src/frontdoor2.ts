const {
  TWILIO_SID,
  TWILIO_TOKEN,
  ACCESS_CODE,
} = process.env;

import * as qs from 'qs';
const twilio = require("twilio");
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

export const handler = async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { Digits } = qs.parse(event.body);

  if (Digits != ACCESS_CODE) {
     return {
       statusCode: 200,
       headers: { "Content-Type": "text/xml" },
       body: `
         <?xml version="1.0" encoding="UTF-8"?>
         <Response> <Dial> +16505764285 </Dial> </Response>
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
    console.log(e);
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
