'use client';

import { useRef, useState } from 'react';
import { BorrowerShell } from '@/components/layout/borrower-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/services/api';
import { borrowerService } from '@/services/borrower.service';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export default function BorrowerUploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast({ title: 'Select a file', variant: 'destructive' });
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Only PDF, JPEG, and PNG are allowed',
        variant: 'destructive',
      });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: 'File too large', description: 'Maximum size is 5 MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const res = await borrowerService.uploadDocument(file);
      toast({ title: 'Upload successful', description: res.data.data.originalName });
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      toast({ title: 'Upload failed', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <BorrowerShell title="Upload">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Salary Slip Upload</CardTitle>
          <CardDescription>PDF, JPEG, or PNG — maximum 5 MB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>
    </BorrowerShell>
  );
}
