import Button from "@/components/button";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

type EditCategoryValues = {
  name: string;
  iconIndex: number;
  colorIndex: number;
};

const schema = Yup.object({
  name: Yup.string().trim().required("Category name is required"),
});

const CATEGORY_ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  "folder",
  "directions-car",
  "restaurant",
  "shopping-bag",
  "description",
  "sports-esports",
  "favorite",
  "card-giftcard",
  "local-cafe",
  "home",
  "flight",
  "music-note",
  "fitness-center",
  "school",
  "local-gas-station",
  "theater-comedy",
];

const COLOR_SWATCHES = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#6B7280",
];

function getInitialValues(params: {
  name?: string;
  icon?: string;
  color?: string;
}): EditCategoryValues {
  const iconIndex = params.icon
    ? Math.max(
        0,
        CATEGORY_ICONS.indexOf(params.icon as (typeof CATEGORY_ICONS)[number]),
      )
    : 0;
  const colorIndex = params.color
    ? Math.max(0, COLOR_SWATCHES.indexOf(params.color))
    : 0;
  return {
    name: params.name ?? "",
    iconIndex: Number.isNaN(iconIndex) ? 0 : iconIndex,
    colorIndex: Number.isNaN(colorIndex) ? 0 : colorIndex,
  };
}

export default function EditCategory() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
  }>();

  const initialValues = React.useMemo(
    () => getInitialValues(params),
    [params.name, params.icon, params.color],
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Edit Category
        </Text>
        <View style={styles.headerRight} />
      </View>

      <Formik<EditCategoryValues>
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={(values) => {
          // TODO: persist update with params.id: { name, icon: CATEGORY_ICONS[iconIndex], color: COLOR_SWATCHES[colorIndex] }
          router.back();
        }}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
        }) => {
          const iconName = CATEGORY_ICONS[values.iconIndex];
          const swatchColor = COLOR_SWATCHES[values.colorIndex];
          const nameError = touched.name && errors.name;

          return (
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={0}
            >
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    styles.previewCard,
                    { backgroundColor: colors.slate[800] },
                  ]}
                >
                  <View
                    style={[
                      styles.previewIconWrap,
                      { backgroundColor: `${swatchColor}30` },
                    ]}
                  >
                    <View
                      style={[
                        styles.previewIconInner,
                        { backgroundColor: swatchColor },
                      ]}
                    >
                      <MaterialIcons
                        name={iconName}
                        size={40}
                        color="#fff"
                      />
                    </View>
                  </View>
                  <Text style={[styles.previewLabel, { color: colors.primary }]}>
                    PREVIEW
                  </Text>
                  <Text
                    style={[styles.previewName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {values.name.trim() || "New Category"}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                    Category Name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.slate[800],
                        borderColor: nameError
                          ? colors.danger
                          : colors.slate[700],
                        color: colors.textPrimary,
                      },
                    ]}
                    placeholder="e.g., Subscriptions"
                    placeholderTextColor={colors.textSecondary}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    autoCapitalize="words"
                  />
                  {nameError ? (
                    <Text style={[styles.errorText, { color: colors.danger }]}>
                      {errors.name}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                      Select Icon
                    </Text>
                    <Text style={[styles.sectionHint, { color: colors.primary }]}>
                      {CATEGORY_ICONS.length} icons
                    </Text>
                  </View>
                  <FlatList
                    data={CATEGORY_ICONS}
                    numColumns={4}
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.iconGridRow}
                    style={styles.iconGrid}
                    renderItem={({ item: icon, index }) => {
                      const selected = values.iconIndex === index;
                      return (
                        <Pressable
                          style={[
                            styles.iconCell,
                            {
                              backgroundColor: colors.slate[800],
                            },
                            selected && {
                              backgroundColor: colors.primary,
                            },
                          ]}
                          onPress={() => setFieldValue("iconIndex", index)}
                        >
                          <MaterialIcons
                            name={icon}
                            size={24}
                            color={selected ? "#fff" : colors.textPrimary}
                          />
                        </Pressable>
                      );
                    }}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                    Personalize Color
                  </Text>
                  <View style={styles.colorRow}>
                    {COLOR_SWATCHES.map((hex, index) => {
                      const selected = values.colorIndex === index;
                      return (
                        <Pressable
                          key={hex}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: hex },
                            selected && styles.colorSwatchSelected,
                          ]}
                          onPress={() => setFieldValue("colorIndex", index)}
                        >
                          {selected && (
                            <MaterialIcons name="check" size={18} color="#fff" />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                  onPress={() => handleSubmit()}
                  style={styles.saveBtn}
                  disabled={!values.name.trim()}
                >
                  <Text style={styles.saveBtnText}>Update Category</Text>
                  <MaterialIcons name="check" size={22} color="#fff" />
                </Button>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 48,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.Manrope.Bold,
  },
  headerRight: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  previewCard: {
    borderRadius: border.borderRadius.xl,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  previewIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  previewIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  previewLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  previewName: {
    fontSize: fontSize.xl,
    fontFamily: fonts.Manrope.Bold,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Medium,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 4,
  },
  iconGrid: {},
  iconGridRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  iconCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: border.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchSelected: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 54,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Bold,
  },
});
