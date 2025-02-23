import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import type { SearchQuery, Report } from "@/lib/email/sendEmail";

export async function generateSearchReport(): Promise<Report> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const searches = await prisma.searchHistory.findMany({
    where: {
      createdAt: {
        gte: yesterday,
      },
    },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const report = {
    date: format(new Date(), "dd-MM-yyyy"),
    totalSearches: searches.length,
    searchesByUser: searches.reduce((acc, search) => {
      const email = search.user.email;
      if (!acc[email]) {
        acc[email] = {
          username: search.user.username,
          searches: [],
        };
      }
      acc[email].searches.push({
        query: JSON.parse(search.query) as SearchQuery,
        time: format(search.createdAt, "HH:mm:ss"),
      });
      return acc;
    }, {} as Report["searchesByUser"]),
  };

  return report;
}
