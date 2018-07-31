import * as moment from "moment-timezone";

export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
  // 8AM - 8PM
  const start = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(8, "hours");
  const end = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(20, "hours");
  const now = moment().tz("America/Los_Angeles");
  const allowedTime = start <= now && now <= end;

  if (!allowedTime) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response> <Dial> +16505764285 </Dial> </Response>
      `.trim()
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Gather numDigits="4" timeout="30" action="/Prod/front-door2">
          <Say>Hello. Please enter your 4 digit security code.</Say>
        </Gather>
      </Response>
    `.trim()
  };
};
