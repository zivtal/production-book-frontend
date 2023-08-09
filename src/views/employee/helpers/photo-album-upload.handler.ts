import { computed, ref, Ref } from 'vue';
import { UPLOAD_PHOTO } from '@/views/employee/store/constants';
import ServerError from '@/shared/services/api-service/server-error';
import ImageService from '@/shared/services/image-service/image.service';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';

const kb = (bulk: Array<{ size: number }> | number): number =>
  (Array.isArray(bulk) ? bulk : [{ size: bulk }]).reduce((sum: number, { size }) => sum + size / 1024, 0) || 0;
const kbps = (kiloBytes: number, startTime: number, endTime: number = Date.now()): number =>
  kiloBytes && startTime ? Math.ceil(kiloBytes / ((endTime - startTime) / 1000)) : 0;

export function photoAlbumUploadHandler(
  chunkSize: number,
  megaPixel = 3,
  options?: { successCallback?: () => void }
): {
  kbps: Ref<number>;
  bytes: Ref<number>;
  percentage: Ref<number>;
  percent: Ref<number>;
  estimate: Ref<[number, number, number] | null>;
  filename: Ref<string>;
  remaining: Ref<number>;
  total: Ref<number>;
  upload: (files?: Array<File>) => Promise<void>;
  reset: () => void;
  loading: Ref<boolean>;
  error: Ref<ServerError | null>;
} {
  const bulk = ref<Array<File>>([]);
  const startTime = ref<number>(0);
  const kbPassed = ref<number>(0);

  const loading = ref(false);
  const error = ref<ServerError | null>(null);
  const filename = ref<string>('');
  const totalFiles = ref<number>(0);
  const fileRemaining = ref<number>(0);

  const bytesLeft = computed(() => bulk.value.reduce((bytes, { size }) => bytes + size, 0));
  const estimateKbps = computed(() => kbps(kbPassed.value, startTime.value));
  const estimateTimeLeft = computed(() => Math.ceil(kb(bulk.value) / estimateKbps.value));
  const percentage = computed(() => kbPassed.value / (kbPassed.value + kb(bulk.value)));
  const percent = computed(() => (percentage.value ? Math.ceil(percentage.value * 100) : 0));
  const estimateTime = computed((): [number, number, number] | null => {
    return estimateTimeLeft.value
      ? [
          (estimateTimeLeft.value % 3600) % 60,
          ((estimateTimeLeft.value % 3600) - ((estimateTimeLeft.value % 3600) % 60)) / 60,
          (estimateTimeLeft.value - (estimateTimeLeft.value % 3600)) / 3600,
        ]
      : null;
  });

  const { useActions } = useEmployeeStore();
  const { [UPLOAD_PHOTO]: uploadPhotoAction } = useActions([UPLOAD_PHOTO]);

  const upload = async (files?: Array<File>): Promise<void> => {
    if (files) {
      set(files);
    }

    if (!bulk.value.length) {
      options?.successCallback?.();
      reset();

      return;
    }

    if (!startTime.value) {
      loading.value = true;
      startTime.value = Date.now();
      error.value = null;
    }

    const chunk = bulk.value.splice(0, chunkSize);

    try {
      const payload = await Promise.all(
        chunk.map(async (file) => {
          const [image, thumb] = await ImageService.imageMultiResize(file, [
            { megaPixel, type: 'image/jpeg' },
            { megaPixel: 0.1, quality: 0.6, type: 'image/jpeg' },
          ]);

          return { file: image.file, thumb: thumb.base64, size: file.size };
        })
      );

      payload.forEach(({ file, size }, index) => {
        setTimeout(() => {
          kbPassed.value = kbPassed.value + kb(size);
          filename.value = file.name;
          fileRemaining.value = fileRemaining.value - 1;
        }, (kb(payload.slice(0, index)) / estimateKbps.value) * 1000);
      });

      await uploadPhotoAction(payload);
    } catch (e) {
      console.log(e);
    }

    await upload();
  };

  const reset = () => {
    bulk.value = [];
    kbPassed.value = 0;
    startTime.value = 0;

    if (loading.value) {
      options?.successCallback?.();
    }

    loading.value = false;
    error.value = null;
  };

  const set = (files: Array<File>): void => {
    reset();
    bulk.value = files;
    totalFiles.value = files.length;
    fileRemaining.value = files.length;
  };

  return {
    bytes: bytesLeft,
    estimate: estimateTime,
    kbps: estimateKbps,
    remaining: fileRemaining,
    total: totalFiles,
    percentage,
    percent,
    filename,
    loading,
    error,
    upload,
    reset,
  };
}
