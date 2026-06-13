import { useState, useCallback } from 'react';
import DeleteConfirmDialog from '@/components/modal/DeleteConfirmModal';
import AlertModal from '@/components/modal/AlertModal';

interface UseDeleteConfirmOptions {
  onDelete: (id: number) => Promise<string>;
  confirmMessage?: string;
  onSuccess?: () => void;
}

export function useDeleteConfirm({ onDelete, confirmMessage = '삭제하시겠습니까?', onSuccess }: UseDeleteConfirmOptions) {
  const [targetId, setTargetId] = useState<number | null>(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'error'>('success');

  const requestDelete = useCallback((id: number) => {
    setTargetId(id);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (targetId === null) return;
    try {
      const msg = await onDelete(targetId);
      setAlertMsg(msg);
      setAlertVariant('success');
      setTargetId(null);
      onSuccess?.();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || '삭제에 실패했습니다.');
      setAlertVariant('error');
      setTargetId(null);
    }
  }, [targetId, onDelete, onSuccess]);

  const handleCancel = useCallback(() => {
    setTargetId(null);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertMsg('');
  }, []);

  const DeleteConfirmModal = (
    <>
      <DeleteConfirmDialog
        open={targetId !== null}
        title="삭제 확인"
        message={confirmMessage}
        confirmText="삭제"
        variant="danger"
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
      <AlertModal
        open={!!alertMsg}
        message={alertMsg}
        variant={alertVariant}
        onClose={handleCloseAlert}
      />
    </>
  );

  return { requestDelete, DeleteConfirmModal };
}
