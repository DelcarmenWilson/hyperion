import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
      "id",
      "account_id",
      "name",
      "title",
      "body",
      "call_to_action_type",
      "image_hash",
      "image_url",
      "object_type",
      "thumbnail_url",
      "status",
      "video_id",

      // "account_id",
      // "actor_id",
      // "adlabels",
      // "applink_treatment",
      // "asset_feed_spec",
      // "authorization_category",
      // "auto_update",
      // "body",
      // "branded_content",
      // "branded_content_sponsor_page_id",
      // "bundle_folder_id",
      // "call_to_action_type",
      // "categorization_criteria",
      // "category_media_source",
      // "collaborative_ads_lsb_image_bank_id",
      // "contextual_multi_ads",
      // "creative_sourcing_spec",
      // "degrees_of_freedom_spec",
      // "destination_set_id",
      // "dynamic_ad_voice",
      // "effective_authorization_category",
      // "effective_instagram_media_id",
      // "effective_instagram_story_id",
      // "effective_object_story_id",
      // "enable_direct_install",
      // "enable_launch_instant_app",
      // "facebook_branded_content",
      // "id",
      // "image_crops",
      // "image_hash",
      // "image_url",
      // "instagram_actor_id",
      // "instagram_branded_content",
      // "instagram_permalink_url",
      // "instagram_story_id",
      // "instagram_user_id",
      // "interactive_components_spec",
      // "link_deep_link_url",
      // "link_destination_display_url",
      // "link_og_id",
      // "link_url",
      // "name",
      // "object_id",
      // "object_store_url",
      // "object_story_id",
      // "object_story_spec",
      // "object_type",
      // "object_url",
      // "omnichannel_link_spec",
      // "page_welcome_message",
      // "photo_album_source_object_story_id",
      // "place_page_set_id",
      // "platform_customizations",
      // "playable_asset_id",
      // "portrait_customizations",
      // "product_set_id",
      // "recommender_settings",
      // "source_instagram_media_id",
      // "status",
      // "template_url",
      // "template_url_spec",
      // "thumbnail_id",
      // "thumbnail_url",
      // "title",
      // "url_tags",
      // "use_page_actor_override",
      // "video_id"
    ];
    params = {
      limit: 20,
    };

    const creatives = await account.getAdCreatives(fields, params);

    return NextResponse.json(creatives, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_ADS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
