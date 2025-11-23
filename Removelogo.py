from video_text_remover import VideoTextRemover

processor = VideoTextRemover()
detections = processor.detect_text_regions("Mercedes-Benz_Reinvention.mp4")
# detections will show detected text/logo regions, find the index of notebookllm text/logo
selected_regions = [index_of_notebookllm_text_logo]

output_path = processor.process_video("Mercedes-Benz_Reinvention_Removed.mp4", remove_regions=selected_regions)
print(f"Cleaned video saved to: {output_path}")
