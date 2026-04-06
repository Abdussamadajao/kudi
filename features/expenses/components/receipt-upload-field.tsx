import { fonts, fontSize } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type ReceiptUploadFieldProps = {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
};

async function uploadToCloudinary(uri: string): Promise<string> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are missing");
  }

  const form = new FormData();
  form.append("file", {
    uri,
    type: "image/jpeg",
    name: `receipt-${Date.now()}.jpg`,
  } as unknown as Blob);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const data = await res.json();
  if (!res.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url as string;
}

export default function ReceiptUploadField({
  label = "UPLOAD RECEIPT",
  value,
  onChange,
}: ReceiptUploadFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(value ?? null);

  useEffect(() => {
    setPreviewUri(value ?? null);
  }, [value]);

  const pickReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const localUri = result.assets[0].uri;
    setPreviewUri(localUri);
    setIsUploading(true);
    try {
      const cloudUrl = await uploadToCloudinary(localUri);
      onChange(cloudUrl);
      setPreviewUri(cloudUrl);
    } catch {
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        onPress={pickReceipt}
        style={[styles.uploadArea, previewUri && styles.uploadAreaWithImage]}
      >
        {previewUri ? (
          <>
            <Image
              source={{ uri: previewUri }}
              style={styles.receiptImage}
              resizeMode="cover"
            />
            <Pressable
              style={styles.removeReceipt}
              onPress={(e) => {
                e.stopPropagation();
                setPreviewUri(null);
                onChange(null);
              }}
            >
              <MaterialIcons name="close" size={18} color="#fff" />
            </Pressable>
          </>
        ) : (
          <>
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <MaterialIcons
                name="cloud-upload"
                size={40}
                color={colors.primary}
              />
            )}
            <Text style={styles.uploadText}>
              {isUploading ? "Uploading..." : "Tap to upload"}
            </Text>
            <Text style={styles.uploadHint}>PNG, JPG up to 10MB</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) => ({
  field: { marginBottom: 18, marginTop: 38 },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  uploadArea: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 24,
    overflow: "hidden" as const,
    borderColor: colors.primary,
    backgroundColor: colors.slate[800],
  },
  uploadAreaWithImage: {
    height: 160,
    padding: 0,
  },
  receiptImage: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  removeReceipt: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.danger,
  },
  uploadText: {
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 8,
    color: colors.textPrimary,
  },
  uploadHint: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 4,
    color: colors.textSecondary,
  },
});
