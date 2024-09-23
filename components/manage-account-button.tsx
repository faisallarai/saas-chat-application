import { generatePortalLink } from '@/actions/generate-portal-link';
import React from 'react';

export const ManageAccountButtton = () => {
  return (
    <form action={generatePortalLink}>
      <button type="submit">Manage Billing</button>
    </form>
  );
};
