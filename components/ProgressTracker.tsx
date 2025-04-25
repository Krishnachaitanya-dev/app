import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '@/constants/theme';
import { OrderStatus } from '@/types';
import { Check } from 'lucide-react-native';

interface ProgressTrackerProps {
  status: OrderStatus;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ status }) => {
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'picked-up', label: 'Picked Up' },
    { status: 'processing', label: 'Processing' },
    { status: 'ready-for-delivery', label: 'Ready' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (stepStatus: OrderStatus) => {
    return steps.findIndex(step => step.status === stepStatus);
  };

  const currentStepIndex = getStepIndex(status);

  const isStepCompleted = (index: number) => {
    return currentStepIndex > index || (currentStepIndex === index && status === 'delivered');
  };

  const isStepActive = (index: number) => {
    return currentStepIndex === index;
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.status}>
            {/* Step circle */}
            <View
              style={[
                styles.stepCircle,
                isStepCompleted(index) && styles.completedStepCircle,
                isStepActive(index) && styles.activeStepCircle,
              ]}
            >
              {isStepCompleted(index) ? (
                <Check size={16} color={theme.colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isStepActive(index) && styles.activeStepNumber,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  isStepCompleted(index) && styles.completedConnector,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.labelsContainer}>
        {steps.map((step, index) => (
          <View key={`label-${step.status}`} style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                isStepCompleted(index) && styles.completedLabel,
                isStepActive(index) && styles.activeLabel,
              ]}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.l,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.grayLight,
    borderWidth: 2,
    borderColor: theme.colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepCircle: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  completedStepCircle: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stepNumber: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  activeStepNumber: {
    color: theme.colors.primary,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.grayDark,
    marginHorizontal: 5,
  },
  completedConnector: {
    backgroundColor: theme.colors.primary,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  labelContainer: {
    width: 60,
    alignItems: 'center',
  },
  label: {
    fontSize: theme.fontSizes.xs,
    textAlign: 'center',
    color: theme.colors.textLight,
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  completedLabel: {
    color: theme.colors.text,
    fontWeight: '500',
  },
});

export default ProgressTracker;