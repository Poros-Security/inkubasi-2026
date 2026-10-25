import { submitName } from "../../actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name } = await request.json();
  const result = await submitName(name);
  return NextResponse.json(result);
}
