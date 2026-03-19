import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const trackingRouteLineStyle = {
  lineColor: '#FF6A00',
  lineWidth: 5,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};

export const trackingFinishCircleStyle = {
  circleColor: '#FF6A00',
  circleRadius: 6,
  circleStrokeWidth: 3,
  circleStrokeColor: '#FFF7ED',
};

export const trackingMapNativeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#DDEEDF',
  },
  mapShell: {
    flex: 1,
  },
  mapFill: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(35, 44, 38, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6A00',
  },
  liveBadgeText: {
    color: '#FFF7ED',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(35, 44, 38, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    backgroundColor: 'rgba(58, 70, 61, 0.94)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  statLabel: {
    color: '#C5D6C5',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '800',
  },
  statValueCompact: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
  },
  statUnit: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  sideControls: {
    position: 'absolute',
    right: 12,
    bottom: 112,
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(48, 59, 52, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  pauseButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(26, 31, 29, 0.94)',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  finishButton: {
    flex: 1.15,
    borderRadius: 14,
    backgroundColor: '#FF6A00',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  fallbackScreen: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    padding: 16,
  },
  fallbackCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 12,
  },
});
