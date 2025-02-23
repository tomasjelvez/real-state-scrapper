import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SearchQuery {
  operation: string;
  propertyType: string;
  location?: string;
}

export interface SearchData {
  query: SearchQuery;
  time: string;
}

export interface UserSearches {
  username: string;
  searches: SearchData[];
}

export interface Report {
  date: string;
  totalSearches: number;
  searchesByUser: Record<string, UserSearches>;
}

export async function sendDailyReport(report: Report) {
  const formattedDate = format(new Date(), "dd-MM-yyyy");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2c5282; border-bottom: 2px solid #4299e1; padding-bottom: 10px; }
          h2 { color: #2b6cb0; margin-top: 30px; }
          .stats { background: #ebf8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
          ul { list-style-type: none; padding: 0; }
          li { 
            background: #fff;
            padding: 10px 15px;
            margin: 8px 0;
            border-radius: 4px;
            border-left: 4px solid #4299e1;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .time { color: #718096; font-size: 0.9em; }
          .query-details { margin-left: 10px; color: #4a5568; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reporte de búsquedas diarias el día ${formattedDate}</h1>
          <div class="stats">
            <strong>Total de búsquedas:</strong> ${report.totalSearches}
          </div>
          ${Object.entries(report.searchesByUser)
            .map(
              ([email, data]) => `
              <h2>Usuario: ${data.username}</h2>
              <p style="color: #718096;">${email}</p>
              <ul>
                ${data.searches
                  .map(
                    (search) => `
                    <li>
                      <span class="time">${search.time}</span>
                      <div class="query-details">
                        <strong>Operación:</strong> ${search.query.operation}
                        <br/>
                        <strong>Tipo de propiedad:</strong> ${
                          search.query.propertyType
                        }
                        ${
                          search.query.location
                            ? `<br/><strong>Ubicación:</strong> ${search.query.location}`
                            : ""
                        }
                      </div>
                    </li>
                  `
                  )
                  .join("")}
              </ul>
            `
            )
            .join("")}
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.REPORT_EMAIL,
    subject: `Reporte de búsquedas diarias - ${formattedDate}`,
    html,
  });
}
