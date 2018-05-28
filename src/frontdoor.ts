const moment = require("moment-timezone");

export const handler = async (): Promise<AWSLambda.APIGatewayProxyResult> => {
  // 8AM - 6PM
  const start = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(8, "hours");
  const end = moment()
    .tz("America/Los_Angeles")
    .startOf("day")
    .add(18, "hours");
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
        <Pause length="1"/>
        <Say>Hello. Who is it?</Say>
        <Record timeout="2" playBeep="false" action="/Prod/front-door2"/>
      </Response>
    `.trim()
  };
};
