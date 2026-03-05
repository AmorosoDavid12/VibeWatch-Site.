'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeedbackItem {
  id: string;
  created_at: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  app_version: string;
  image_urls: string[] | null;
  admin_notes: string | null;
  admin_response: string | null;
  group_id: string | null;
  device_info: string | null;
  feedback_groups: { title: string; status: string } | null;
}

interface FeedbackGroup {
  id: string;
  created_at: string;
  title: string;
  status: string;
  admin_notes: string | null;
  admin_response: string | null;
  user_feedback: { count: number }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['all', 'bug', 'suggestion', 'improvement'] as const;
const STATUSES = ['all', 'open', 'in_progress', 'resolved', 'closed'] as const;
const GROUP_FILTERS = ['all', 'ungrouped', 'grouped'] as const;

const CATEGORY_STYLES: Record<string, string> = {
  bug: 'bg-red-600/20 text-red-400',
  suggestion: 'bg-blue-600/20 text-blue-400',
  improvement: 'bg-green-600/20 text-green-400',
};

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-gray-600/20 text-gray-400',
  in_progress: 'bg-orange-600/20 text-orange-400',
  resolved: 'bg-green-600/20 text-green-400',
  closed: 'bg-red-600/20 text-red-400',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Badge({ label, styles }: { label: string; styles: Record<string, string> }) {
  const cls = styles[label] || 'bg-gray-600/20 text-gray-400';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${cls}`}>
      {label.replace('_', ' ')}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FeedbackDashboard() {
  const [tab, setTab] = useState<'feedback' | 'groups'>('feedback');

  // Feedback state
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [groups, setGroups] = useState<FeedbackGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  // Group modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [groupModalTab, setGroupModalTab] = useState<'new' | 'existing' | 'remove'>('new');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // ─── Data fetching ──────────────────────────────────────────────────────

  const fetchFeedback = useCallback(async () => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (status !== 'all') params.set('status', status);
    if (groupFilter !== 'all') params.set('group', groupFilter);
    params.set('sort', `created_at.${sortAsc ? 'asc' : 'desc'}`);

    const res = await fetch(`/api/admin/feedback?${params}`);
    if (res.ok) {
      const data = await res.json();
      setFeedback(data);
    }
  }, [category, status, groupFilter, sortAsc]);

  const fetchGroups = useCallback(async () => {
    const res = await fetch('/api/admin/groups');
    if (res.ok) {
      const data = await res.json();
      setGroups(data);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchFeedback(), fetchGroups()]).finally(() => setLoading(false));
  }, [fetchFeedback, fetchGroups]);

  // ─── Actions ────────────────────────────────────────────────────────────

  const updateFeedback = async (id: string, updates: Record<string, unknown>) => {
    const res = await fetch('/api/admin/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) await fetchFeedback();
  };

  const updateGroup = async (id: string, updates: Record<string, unknown>) => {
    const res = await fetch('/api/admin/groups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      await fetchGroups();
      await fetchFeedback();
    }
  };

  const createGroup = async () => {
    if (!newGroupTitle.trim() || selected.size === 0) return;

    const res = await fetch('/api/admin/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newGroupTitle.trim(),
        feedback_ids: Array.from(selected),
      }),
    });

    if (res.ok) {
      setSelected(new Set());
      closeGroupModal();
      await fetchGroups();
      await fetchFeedback();
    }
  };

  const addToExistingGroup = async (groupId: string) => {
    if (selected.size === 0 || !groupId) return;

    const promises = Array.from(selected).map((id) =>
      fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, group_id: groupId }),
      })
    );
    await Promise.all(promises);
    setSelected(new Set());
    closeGroupModal();
    await fetchGroups();
    await fetchFeedback();
  };

  const removeFromGroups = async () => {
    if (selected.size === 0) return;

    const promises = Array.from(selected).map((id) =>
      fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, group_id: null }),
      })
    );
    await Promise.all(promises);
    setSelected(new Set());
    closeGroupModal();
    await fetchGroups();
    await fetchFeedback();
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setNewGroupTitle('');
    setSelectedGroupId('');
    setGroupModalTab('new');
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const res = await fetch('/api/admin/feedback', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    if (res.ok) {
      setSelected(new Set());
      await fetchFeedback();
      await fetchGroups();
    }
  };

  const deleteGroup = async (id: string) => {
    const res = await fetch('/api/admin/groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setExpandedGroupId(null);
      await fetchGroups();
      await fetchFeedback();
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === feedback.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(feedback.map((f) => f.id)));
    }
  };

  const newCount = feedback.filter((f) => f.status === 'open').length;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-6">
      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setTab('feedback')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'feedback'
              ? 'bg-red-600 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Feedback
          {newCount > 0 && (
            <span className="ml-2 bg-red-500/30 text-red-300 text-xs px-1.5 py-0.5 rounded">
              {newCount} new
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('groups')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'groups'
              ? 'bg-red-600 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Groups
        </button>
      </div>

      {tab === 'feedback' ? (
        <FeedbackTab
          feedback={feedback}
          groups={groups}
          loading={loading}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          sortAsc={sortAsc}
          setSortAsc={setSortAsc}
          selected={selected}
          toggleSelect={toggleSelect}
          toggleSelectAll={toggleSelectAll}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          updateFeedback={updateFeedback}
          showGroupModal={showGroupModal}
          setShowGroupModal={setShowGroupModal}
          groupModalTab={groupModalTab}
          setGroupModalTab={setGroupModalTab}
          newGroupTitle={newGroupTitle}
          setNewGroupTitle={setNewGroupTitle}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          createGroup={createGroup}
          addToExistingGroup={addToExistingGroup}
          removeFromGroups={removeFromGroups}
          closeGroupModal={closeGroupModal}
          deleteSelected={deleteSelected}
        />
      ) : (
        <GroupsTab
          groups={groups}
          feedback={feedback}
          loading={loading}
          expandedGroupId={expandedGroupId}
          setExpandedGroupId={setExpandedGroupId}
          updateGroup={updateGroup}
          deleteGroup={deleteGroup}
        />
      )}
    </div>
  );
}

// ─── Feedback Tab ────────────────────────────────────────────────────────────

function FeedbackTab({
  feedback,
  groups,
  loading,
  category,
  setCategory,
  status,
  setStatus,
  groupFilter,
  setGroupFilter,
  sortAsc,
  setSortAsc,
  selected,
  toggleSelect,
  toggleSelectAll,
  expandedId,
  setExpandedId,
  updateFeedback,
  showGroupModal,
  setShowGroupModal,
  newGroupTitle,
  setNewGroupTitle,
  createGroup,
  addToExistingGroup,
  removeFromGroups,
  closeGroupModal,
  groupModalTab,
  setGroupModalTab,
  selectedGroupId,
  setSelectedGroupId,
  deleteSelected,
}: {
  feedback: FeedbackItem[];
  groups: FeedbackGroup[];
  loading: boolean;
  category: string;
  setCategory: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  groupFilter: string;
  setGroupFilter: (v: string) => void;
  sortAsc: boolean;
  setSortAsc: (v: boolean) => void;
  selected: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  updateFeedback: (id: string, updates: Record<string, unknown>) => Promise<void>;
  showGroupModal: boolean;
  setShowGroupModal: (v: boolean) => void;
  groupModalTab: 'new' | 'existing' | 'remove';
  setGroupModalTab: (v: 'new' | 'existing' | 'remove') => void;
  newGroupTitle: string;
  setNewGroupTitle: (v: string) => void;
  selectedGroupId: string;
  setSelectedGroupId: (v: string) => void;
  createGroup: () => Promise<void>;
  addToExistingGroup: (groupId: string) => Promise<void>;
  removeFromGroups: () => Promise<void>;
  closeGroupModal: () => void;
  deleteSelected: () => Promise<void>;
}) {
  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <FilterSelect
          label="Category"
          value={category}
          options={CATEGORIES as unknown as string[]}
          onChange={setCategory}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={STATUSES as unknown as string[]}
          onChange={setStatus}
        />
        <FilterSelect
          label="Group"
          value={groupFilter}
          options={GROUP_FILTERS as unknown as string[]}
          onChange={setGroupFilter}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer"
        >
          {sortAsc ? 'Oldest first' : 'Newest first'}
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 bg-white/5 px-4 py-2 rounded-md">
          <span className="text-gray-400 text-sm">{selected.size} selected</span>
          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Manage Groups
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${selected.size} feedback item${selected.size !== 1 ? 's' : ''}? This cannot be undone.`)) {
                deleteSelected();
              }
            }}
            className="bg-red-900/50 hover:bg-red-900 text-red-300 text-sm px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => {
              selected.forEach((id) => toggleSelect(id));
            }}
            className="text-gray-400 hover:text-white text-sm cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Group management modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-white font-medium mb-4">
              Manage Groups — {selected.size} item{selected.size !== 1 ? 's' : ''}
            </h3>

            {/* Modal tabs */}
            <div className="flex gap-1 mb-4">
              {(['new', 'existing', 'remove'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setGroupModalTab(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    groupModalTab === t
                      ? 'bg-white/15 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'new' ? 'New Group' : t === 'existing' ? 'Add to Group' : 'Remove from Group'}
                </button>
              ))}
            </div>

            {/* New group */}
            {groupModalTab === 'new' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="Group title"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeGroupModal}
                    className="bg-white/10 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createGroup}
                    disabled={!newGroupTitle.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                  >
                    Create & Assign
                  </button>
                </div>
              </div>
            )}

            {/* Add to existing group */}
            {groupModalTab === 'existing' && (
              <div className="space-y-4">
                {groups.length === 0 ? (
                  <p className="text-gray-500 text-sm">No groups exist yet. Create one first.</p>
                ) : (
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="">Select a group...</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeGroupModal}
                    className="bg-white/10 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addToExistingGroup(selectedGroupId)}
                    disabled={!selectedGroupId}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                  >
                    Add to Group
                  </button>
                </div>
              </div>
            )}

            {/* Remove from groups */}
            {groupModalTab === 'remove' && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  This will remove {selected.size} selected item{selected.size !== 1 ? 's' : ''} from
                  their current groups. Items without a group will be unaffected.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeGroupModal}
                    className="bg-white/10 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={removeFromGroups}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                  >
                    Remove from Groups
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : feedback.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No feedback found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === feedback.length && feedback.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Group</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <FeedbackRow
                  key={item.id}
                  item={item}
                  groups={groups}
                  isSelected={selected.has(item.id)}
                  isExpanded={expandedId === item.id}
                  onToggleSelect={() => toggleSelect(item.id)}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  onUpdate={(updates) => updateFeedback(item.id, updates)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── Feedback Row ────────────────────────────────────────────────────────────

function FeedbackRow({
  item,
  groups,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
  onUpdate,
}: {
  item: FeedbackItem;
  groups: FeedbackGroup[];
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
}) {
  const [adminNotes, setAdminNotes] = useState(item.admin_notes || '');
  const [adminResponse, setAdminResponse] = useState(item.admin_response || '');
  const [localStatus, setLocalStatus] = useState(item.status);
  const [localGroupId, setLocalGroupId] = useState(item.group_id || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAdminNotes(item.admin_notes || '');
    setAdminResponse(item.admin_response || '');
    setLocalStatus(item.status);
    setLocalGroupId(item.group_id || '');
  }, [item]);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({
      status: localStatus,
      admin_notes: adminNotes || null,
      admin_response: adminResponse || null,
      group_id: localGroupId || null,
    });
    setSaving(false);
  };

  return (
    <>
      <tr
        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
          isSelected ? 'bg-white/5' : ''
        }`}
      >
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded cursor-pointer"
          />
        </td>
        <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap" onClick={onToggleExpand}>
          {formatDate(item.created_at)}
        </td>
        <td className="px-4 py-3" onClick={onToggleExpand}>
          <Badge label={item.category} styles={CATEGORY_STYLES} />
        </td>
        <td className="px-4 py-3 text-white text-sm font-medium" onClick={onToggleExpand}>
          {item.title}
        </td>
        <td className="px-4 py-3 text-gray-400 text-sm" onClick={onToggleExpand}>
          {item.user_id?.slice(0, 8) || 'Unknown'}
        </td>
        <td className="px-4 py-3 text-gray-500 text-sm" onClick={onToggleExpand}>
          {item.app_version || '—'}
        </td>
        <td className="px-4 py-3" onClick={onToggleExpand}>
          <Badge label={item.status} styles={STATUS_STYLES} />
        </td>
        <td className="px-4 py-3 text-gray-500 text-sm" onClick={onToggleExpand}>
          {item.feedback_groups?.title || '—'}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-[#111] px-6 py-5 border-b border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: description + images */}
              <div>
                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-wrap mb-4">
                  {item.description}
                </p>
                {item.image_urls && item.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.image_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-24 h-24 rounded-md overflow-hidden bg-gray-800"
                      >
                        <img
                          src={url}
                          alt={`Attachment ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: admin controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Status
                  </label>
                  <select
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {STATUSES.filter((s) => s !== 'all').map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Group
                  </label>
                  <select
                    value={localGroupId}
                    onChange={(e) => setLocalGroupId(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="">None</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Internal notes..."
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Admin Response <span className="normal-case text-gray-600">(visible to users)</span>
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Response visible to users..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Groups Tab ──────────────────────────────────────────────────────────────

function GroupsTab({
  groups,
  feedback,
  loading,
  expandedGroupId,
  setExpandedGroupId,
  updateGroup,
  deleteGroup,
}: {
  groups: FeedbackGroup[];
  feedback: FeedbackItem[];
  loading: boolean;
  expandedGroupId: string | null;
  setExpandedGroupId: (id: string | null) => void;
  updateGroup: (id: string, updates: Record<string, unknown>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No groups yet</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                feedback={feedback}
                isExpanded={expandedGroupId === group.id}
                onToggleExpand={() =>
                  setExpandedGroupId(expandedGroupId === group.id ? null : group.id)
                }
                onUpdate={(updates) => updateGroup(group.id, updates)}
                onDelete={() => deleteGroup(group.id)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Group Row ───────────────────────────────────────────────────────────────

function GroupRow({
  group,
  feedback,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: {
  group: FeedbackGroup;
  feedback: FeedbackItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [title, setTitle] = useState(group.title);
  const [localStatus, setLocalStatus] = useState(group.status);
  const [adminNotes, setAdminNotes] = useState(group.admin_notes || '');
  const [adminResponse, setAdminResponse] = useState(group.admin_response || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(group.title);
    setLocalStatus(group.status);
    setAdminNotes(group.admin_notes || '');
    setAdminResponse(group.admin_response || '');
  }, [group]);

  const memberCount =
    group.user_feedback?.[0]?.count ?? 0;

  const members = feedback.filter((f) => f.group_id === group.id);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({
      title: title,
      status: localStatus,
      admin_notes: adminNotes || null,
      admin_response: adminResponse || null,
    });
    setSaving(false);
  };

  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3 text-white text-sm font-medium">{group.title}</td>
        <td className="px-4 py-3">
          <Badge label={group.status} styles={STATUS_STYLES} />
        </td>
        <td className="px-4 py-3 text-gray-400 text-sm">{memberCount}</td>
        <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
          {formatDate(group.created_at)}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={4} className="bg-[#111] px-6 py-5 border-b border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: group details */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Status
                  </label>
                  <select
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {STATUSES.filter((s) => s !== 'all').map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Internal notes..."
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                    Admin Response <span className="normal-case text-gray-600">(visible to users)</span>
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Response visible to users..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete group "${group.title}"? Members will be ungrouped.`)) {
                        onDelete();
                      }
                    }}
                    className="bg-red-900/50 hover:bg-red-900 text-red-300 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Delete Group
                  </button>
                </div>
              </div>

              {/* Right: members */}
              <div>
                <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                  Members ({members.length})
                </h4>
                {members.length === 0 ? (
                  <p className="text-gray-500 text-sm">No members loaded in current view</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white/5 rounded-md px-3 py-2 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-white text-sm">{m.title}</span>
                          <span className="text-gray-500 text-xs ml-2">
                            {m.user_id?.slice(0, 8)}
                          </span>
                        </div>
                        <Badge label={m.status} styles={STATUS_STYLES} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Filter Select ───────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 text-gray-300 px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}
