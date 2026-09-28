import { NextRequest, NextResponse } from "next/server";
import { getChildCategories } from "@/lib/categories";

export async function GET(request: NextRequest) {
  const parent = request.nextUrl.searchParams.get("parent");
  const parentId = parent ? parseInt(parent, 10) : NaN;

  if (!parentId || Number.isNaN(parentId)) {
    return NextResponse.json({ error: "Missing parent id" }, { status: 400 });
  }

  try {
    const children = await getChildCategories(parentId, 20);
    return NextResponse.json({ children });
  } catch {
    return NextResponse.json({ children: [] }, { status: 200 });
  }
}
