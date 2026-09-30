import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No files selected" },
        { status: 400 }
      );
    }

    const uploaded = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}-${file.name}`;

      const { error } = await supabase.storage
        .from("img")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (error) {
        throw error;
      }

      uploaded.push(fileName);
    }

    return NextResponse.json({
      success: true,
      files: uploaded,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}