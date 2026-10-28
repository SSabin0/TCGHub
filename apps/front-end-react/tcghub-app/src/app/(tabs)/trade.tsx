import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Data ────────────────────────────────────────────────────────────────────
// Placeholder listings until the backend has a listings endpoint.

type ListingType = 'TRADE' | 'SELL' | 'TRADE / SELL';

type Listing = {
  id: string;
  cardName: string;
  artColor: string;
  type: ListingType;
  condition: string;
  seller: string;
  distanceKm: number;
};

const LISTINGS: Listing[] = [
  { id: '1', cardName: 'The One Ring', artColor: '#6E5A2E', type: 'TRADE', condition: 'Near mint', seller: 'Jordan', distanceKm: 1.2 },
  { id: '2', cardName: 'Orcish Bowmasters', artColor: '#3B3550', type: 'SELL', condition: 'Lightly played', seller: 'Priya', distanceKm: 2.8 },
  { id: '3', cardName: 'Ragavan, Nimble Pilferer', artColor: '#8A3B2E', type: 'TRADE / SELL', condition: 'Near mint', seller: 'Alex', distanceKm: 3.1 },
  { id: '4', cardName: 'Sheoldred, the Apocalypse', artColor: '#2E2B33', type: 'SELL', condition: 'Near mint', seller: 'Marcus', distanceKm: 4.5 },
  { id: '5', cardName: 'Llanowar Elves', artColor: '#3F6B3A', type: 'TRADE', condition: 'Played', seller: 'Sam', distanceKm: 6.0 },
  { id: '6', cardName: 'Counterspell', artColor: '#34506E', type: 'TRADE / SELL', condition: 'Lightly played', seller: 'Jess', distanceKm: 8.4 },
  { id: '7', cardName: 'Sol Ring', artColor: '#5E5A55', type: 'TRADE', condition: 'Near mint', seller: 'Chris', distanceKm: 17.9 },
  { id: '8', cardName: 'Lightning Bolt', artColor: '#9A4A22', type: 'SELL', condition: 'Played', seller: 'Mia', distanceKm: 32.5 },
];

const DISTANCES_KM = [5, 10, 25, 50];

// Placeholder until messages come from the backend.
const UNREAD_MESSAGES = 3;

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TradeScreen() {
  const [radiusKm, setRadiusKm] = useState(10);

  // IDs of the listings the user has added to their wishlist.
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Add the ID if it isn't in the list yet, remove it if it is.
  const toggleWishlist = (id: string) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  };

  // Only show listings within the selected distance.
  const listings = LISTINGS.filter((listing) => listing.distanceKm <= radiusKm);

  return (
    // The outer View holds two things side by side in the layout:
    // the scrolling content, and the floating messages button on top of it.
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            LISTED CARDS
          </Text>

          <Pressable
            onPress={() => console.log('List a card pressed')}
            accessibilityRole="button"
            accessibilityLabel="List a card"
            style={styles.listButton}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.listButtonText}>LIST A CARD</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Buy, sell and trade with players near you.</Text>

        {/* Location */}
        <Pressable
          onPress={() => console.log('Change location pressed')}
          accessibilityRole="button"
          accessibilityLabel="Location: Melbourne, VIC. Tap to change."
          style={styles.locationPicker}
        >
          <Ionicons name="location-outline" size={20} color="#245f28" />
          <View style={styles.locationText}>
            <Text style={styles.locationLabel}>LOCATION</Text>
            <Text style={styles.locationValue}>Melbourne, VIC</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#171717" />
        </Pressable>

        {/* Distance */}
        <View style={styles.distanceRow} accessibilityRole="radiogroup">
          {DISTANCES_KM.map((km) => {
            const selected = km === radiusKm;
            return (
              <Pressable
                key={km}
                onPress={() => setRadiusKm(km)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`Within ${km} kilometres`}
                style={[styles.distanceChip, selected && styles.distanceChipSelected]}
              >
                <Text style={[styles.distanceText, selected && styles.distanceTextSelected]}>
                  {km} km
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Listings */}
        <View style={styles.grid}>
          {listings.map((listing) => (
             <ListingCard
              key={listing.id}
              listing={listing}
              saved={wishlist.includes(listing.id)}
              onToggleWishlist={() => toggleWishlist(listing.id)}
            />
          ))}
        </View>

        {listings.length === 0 && (
          <Text style={styles.emptyMessage}>No cards listed within {radiusKm} km.</Text>
        )}
      </ScrollView>

      {/* Floating messages button — outside the ScrollView so it stays put */}
      <Pressable
        onPress={() => console.log('Messages pressed')}
        accessibilityRole="button"
        accessibilityLabel={`Messages, ${UNREAD_MESSAGES} unread`}
        style={styles.messagesButton}
      >
        <Ionicons name="chatbubble-outline" size={26} color="#E2D7BD" />
        {UNREAD_MESSAGES > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{UNREAD_MESSAGES}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

type ListingCardProps = {
  listing: Listing;
  saved: boolean;
  onToggleWishlist: () => void;
};

function ListingCard({ listing, saved, onToggleWishlist }: ListingCardProps) {
  return (
    <View style={styles.card}>
      {/* Card picture (placeholder colour until real card images are used) */}
      <View style={styles.cardFrame}>
        <View style={[styles.cardArt, { backgroundColor: listing.artColor }]}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{listing.type}</Text>
          </View>
          <Text style={styles.cardArtName} numberOfLines={2}>
            {listing.cardName}
          </Text>
        </View>
         {/* Wishlist heart — top right of the picture */}
        <Pressable
          onPress={onToggleWishlist}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={
            saved
              ? `Remove ${listing.cardName} from wishlist`
              : `Add ${listing.cardName} to wishlist`
          }
          style={styles.wishlistButton}
        >
          <View style={[styles.wishlistCircle, saved && styles.wishlistCircleSaved]}>
            <MaterialCommunityIcons
              name={saved ? 'heart' : 'heart-plus-outline'}
              size={19}
              color={saved ? '#FFFFFF' : '#171717'}
            />
          </View>
        </Pressable>
      </View>

      {/* Details */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {listing.cardName}
        </Text>
        <Text style={styles.cardCondition}>{listing.condition}</Text>
        <View style={styles.sellerRow}>
          <Ionicons name="location-outline" size={13} color="#3A342B" />
          <Text style={styles.sellerText}>
            {listing.seller} · {listing.distanceKm.toFixed(1)} km
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => console.log('Message', listing.seller, 'about', listing.cardName)}
        accessibilityRole="button"
        accessibilityLabel={`Message ${listing.seller} about ${listing.cardName}`}
        style={styles.messageButton}
      >
        <Ionicons name="chatbubble-outline" size={17} color="#171717" />
        <Text style={styles.messageButtonText}>MESSAGE</Text>
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 96, // room so the floating button never covers the last card
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 40,
    lineHeight: 44,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
    marginTop: 2,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
  },
  listButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },

  // Location
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.9,
    color: '#5A5246',
  },
  locationValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#171717',
  },

  // Distance
  distanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  distanceChip: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceChipSelected: {
    backgroundColor: '#171717',
  },
  distanceText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 0.8,
    color: '#171717',
  },
  distanceTextSelected: {
    color: '#E2D7BD',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    marginTop: 16,
  },
  card: {
    width: '48%',
    gap: 8,
  },
  cardFrame: {
    aspectRatio: 63 / 80,
    padding: 5,
    borderRadius: 12,
    backgroundColor: '#171717',
  },
  cardArt: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 8,
  },
  typeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#E2D7BD',
  },
  typeTagText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    color: '#171717',
  },
  cardArtName: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    color: '#F4EEDF',
  },
    // The 44×44 tappable area; the visible circle inside it is smaller.
  wishlistButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2D7BD',
    boxShadow: '0 2px 6px rgba(23, 23, 23, 0.35)',
  },
  wishlistCircleSaved: {
    backgroundColor: '#2e7d32',
  },
  cardInfo: {
    paddingHorizontal: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  cardCondition: {
    fontSize: 13,
    color: '#5A5246',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerText: {
    fontSize: 13,
    color: '#3A342B',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#171717',
  },
  messageButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#171717',
  },

  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },

  // Floating messages button
  messagesButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
    boxShadow: '0 6px 16px rgba(23, 23, 23, 0.28)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E2D7BD',
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});