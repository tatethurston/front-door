const {
  TWILIO_SID,
  TWILIO_TOKEN,
  ACCESS_CODE,
} = process.env;

import * as querystring from "querystring";
import axios from "axios";

export const handler = async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { Digits } = querystring.parse(event.body);
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
    await axios({
      method: "POST",
      url: `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      auth: {
        username: TWILIO_SID,
        password: TWILIO_TOKEN
      },
      data: querystring.stringify({
        Body: `I'm letting someone in. Their access code was ${Digits}`,
        From: "+16505130122",
        To: "+16505764285"
      })
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
